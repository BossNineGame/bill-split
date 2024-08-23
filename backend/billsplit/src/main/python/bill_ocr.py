import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="/Users/akkanit.p/Documents/ocr/key.json"
import re
import copy

def detect_text(path):
    """Detects text in the file."""
    from google.cloud import vision

    client = vision.ImageAnnotatorClient()

    with open(path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.text_detection(image=image)
    texts = response.text_annotations
    #print("Texts:")
    is_price = []
    right_pos = []
    """
    for text in texts:
        is_price.append(is_num(text.description))
    right_most = 
    for text in texts:
        right_pos 
    """

    text_lis = []
    for text in texts:
        #print(f'\n"{text.description}"')
        vertices = [
            f"({vertex.x},{vertex.y})" for vertex in text.bounding_poly.vertices
        ]
        text_lis.append([[
            (vertex.x,vertex.y) for vertex in text.bounding_poly.vertices
        ],text.description])

        #print("bounds: {}".format(",".join(vertices)))

    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )
    return text_lis

def seperate_by_num(lis):
    pattern = r'^-?\d*\.?\d+$'
    num_lis = []
    non_num_lis = []
    for x in lis:
        if re.match(pattern, x[-1]):
            num_lis.append(x)
        else:
            non_num_lis.append(x)
    return num_lis,non_num_lis

def get_column_group(lis):
    horizon_sorted = sorted(lis,key=lambda x: x[0][0])
    ##print(horizon_sorted)
    left_group_list = [[horizon_sorted[0]]]
    right_group_list = [[horizon_sorted[0]]]
    for i in range(1,len(horizon_sorted)):
        cur = horizon_sorted[i]
        prev = horizon_sorted[i-1]
        cur_coor = cur[0]
        prev_coor = prev[0]
        horizon_thresh = cur_coor[2][1] - cur_coor[1][1]
        left_diff = cur_coor[0][0] - prev_coor[0][0]
        right_diff = cur_coor[1][0] - prev_coor[1][0]
        if left_diff <= horizon_thresh:
            left_group_list[-1].append(cur)
        else:
            left_group_list.append([cur])
        if right_diff <= horizon_thresh:
            right_group_list[-1].append(cur)
        else:
            right_group_list.append([cur])
    up_down_right_group_list = []
    up_down_left_group_list = []
    for group in right_group_list:
        up_down_right_group_list.append(sorted(group,key=lambda x: x[0][0][1]))
    for group in left_group_list:
        up_down_left_group_list.append(sorted(group,key=lambda x: x[0][0][1]))
    #for g in up_down_right_group_list:
    #    #print(g)
    result = {'left': up_down_left_group_list, 'right':up_down_right_group_list}
    return result

def get_row_group(lis):
    vertical_sorted = sorted(lis,key=lambda x: x[0][3][1])
    ##print(horizon_sorted)
    group_list = [[vertical_sorted[0]]]
    for i in range(1,len(vertical_sorted)):
        cur = vertical_sorted[i]
        prev = vertical_sorted[i-1]
        cur_coor = cur[0]
        prev_coor = prev[0]
        vertical_thresh = cur_coor[2][1] - cur_coor[1][1]
        vertical_diff = cur_coor[3][1] - prev_coor[3][1]
        if vertical_diff <= vertical_thresh:
            group_list[-1].append(cur)
        else:
            group_list.append([cur])
    x_group_list = []
    for group in group_list:
        x_group_list.append(sorted(group,key=lambda x: x[0][3][0]))
    return x_group_list

def merge_horizon(lis):
    old_lis = copy.deepcopy(lis)
    new_lis = []
    for g in old_lis:
        new_g = []
        merged_point = None
        right_edge = None
        for p in g:
            coor = p[0]
            text = p[1]
            left_edge = (coor[0][0] + coor[3][0])/2
            thresh = coor[3][1] - coor[0][1]
            if merged_point == None:
                merged_point = p
                right_edge = (coor[1][0] + coor[2][0])/2
            else:
                if abs(left_edge - right_edge) <= thresh:
                    merged_point_coor = merged_point[0]
                    merged_point_coor[1] = coor[1]
                    merged_point_coor[2] = coor[2]
                    merged_point[0] = merged_point_coor
                    merged_point[1] = merged_point[1] + text
                    #print(merged_point)
                    right_edge = (coor[1][0] + coor[2][0])/2
                else:
                    new_g.append(merged_point)
                    merged_point = p
                    right_edge = (coor[1][0] + coor[2][0])/2
        new_g.append(merged_point)
        new_lis.append(new_g)
    #for g in new_lis:
        #print(g)
    return new_lis

def ungroup(lis):
    new_lis = []
    for g in lis:
        new_lis.extend(g)
    return new_lis 

def match_price_menu(menu_candidate_lis,price_col,count_col):
    matched_i = None
    max_matched = 0
    max_matched_info = []
    for i in range(len(menu_candidate_lis)):
        target_g = menu_candidate_lis[i]
        matched = 0
        matched_info = []
        for j in range(len(price_col)):
            thresh = (price_col[j][0][3][1] - price_col[j][0][0][1])/2
            for k in range(len(target_g)):
                if abs(target_g[k][0][3][1] - price_col[j][0][3][1]) <= thresh:
                    matched += 1
                    matched_info.append((j,k))
                    break
                if target_g[k][0][3][1] - price_col[j][0][3][1] > 0:
                    break
        if matched > max_matched:
            max_matched = matched
            matched_i = i
            max_matched_info = matched_info
    menu_matched = menu_candidate_lis[matched_i]
    price_list = []
    menu = []
    count_list = []
    if count_col == None:
        count_list = None
    for i in range(len(max_matched_info)):
        price_i = max_matched_info[i][0]
        menu_i = max_matched_info[i][1]
        price_list.append(float(price_col[price_i][-1]))
        menu.append(menu_matched[menu_i][-1])
        if count_col != None:
            for k in range(len(count_col)):
                ##print(i,k,count_col[k][0][3][1] - price_col[j][0][3][1])
                if abs(count_col[k][0][3][1] - price_col[price_i][0][3][1]) <= thresh:
                    count = count_col[k][-1]
                    count_float = float(count_col[k][-1])
                    count_int = int(count_float)
                    if count_float != count_int:
                        count_list.append(None)
                    else:
                        count_list.append(count_int)
                    ##print(i,k,count_list)
                    break
                if count_col[k][0][3][1] - price_col[price_i][0][3][1] > 0:
                    #print('count unmatched')
                    count_list.append(None)
                    break
    if count_list == None:
        return {'price':price_list,'menu':menu,'count':[1]*len(menu)}   
    all_count_is_none = True 
    first_count_is_none = False
    if count_list[0] == None:
        first_count_is_none = True
    for i in range(len(count_list)):
        if count_list[i] != None:
            all_count_is_none = False
    if all_count_is_none:
        return {'price':price_list,'menu':menu,'count':[1]*len(menu)}
    if first_count_is_none:
        return {'price':price_list[1:],'menu':menu[1:],'count':count_list[1:]}  
    return {'price':price_list,'menu':menu,'count':count_list}    

def classify_num_columns(group_lis):
    """
    max_len = 0
    max_i = None
    for i in range(len(group_lis)):
        g = group_lis[i]
        if len(g) > max_len:
            max_len = len(g)
            max_i = i
    num_col = group_lis[max_i]
    result = {'price':num_col}
    """
    num_col = group_lis[-1]
    result = {'price':num_col,'count':None}
    max_matched = 0
    matched_i = None
    for i in range(len(group_lis)-1):
        target_g = group_lis[i]
        matched = 0
        for j in range(len(num_col)):
            thresh = (num_col[j][0][3][1] - num_col[j][0][0][1])/2
            for k in range(len(target_g)):
                if abs(target_g[k][0][3][1] - num_col[j][0][3][1]) <= thresh:
                    matched += 1
                    break
                if target_g[k][0][3][1] - num_col[j][0][3][1] > 0:
                    break
        if matched > max_matched:
            max_matched = matched
            matched_i = i
            
    if matched_i != None:
        result['count'] = group_lis[matched_i]
    
    return result

def get_slip_info(path):
    text_lis = detect_text(path)
    text_lis = text_lis[1:]
    num_text_lis,non_num_list = seperate_by_num(text_lis)
    num_grouped = get_column_group(num_text_lis)
    non_num_grouped = get_row_group(non_num_list)
    new_non_num_grouped = merge_horizon(non_num_grouped)
    big_text_lis = ungroup(new_non_num_grouped)
    non_num_column_grouped = get_column_group(big_text_lis)
    price_and_count = classify_num_columns(num_grouped['right'])
    slip_info = match_price_menu(non_num_column_grouped['left'],price_and_count['price'],price_and_count['count'])

    return slip_info




print(get_slip_info('/Users/akkanit.p/Documents/ocr_nine/453452904_455141460679721_4797457180477520733_n.jpg'))
    
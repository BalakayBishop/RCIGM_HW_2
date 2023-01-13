from project.models.models import User

def is_valid(username_check):
	usernameExist = User.query.filter_by(username=username_check).one_or_none()
	if usernameExist is None:
		return True
	elif usernameExist is not None:
		return False


def convert(obj):
	lst = []
	if type(obj) == list:
		for i in range(0, len(obj)):
			lst.append(obj[i].as_dict())
	else:
		lst.append(obj.as_dict())
	return lst


def get_user(userName):
	user = User.query.filter_by(username=userName).one_or_none()
	if user is not None:
		return convert(user)
	else:
		return None
	
def remove_dupes(lst):
	new_list = []
	for item in lst:
		if item not in new_list:
			new_list.append(item)
	return new_list

def remove_indices(indices, obj_lst):
	new_list = [item for i, item in enumerate(obj_lst) if i not in indices]
	return new_list
	
	
def convert_join(obj):
	lst = []
	if type(obj) == list:
		for i in range(0, len(obj)):
			my_dict = {}
			for index, key in enumerate(obj[i]):
				if index == 0:
					my_dict['id'] = obj[i][index]
				elif index == 1:
					my_dict['firstName'] = obj[i][index]
				elif index == 2:
					my_dict['lastName'] = obj[i][index]
				elif index == 3:
					my_dict['userName'] = obj[i][index]
				else:
					my_dict['filePath'] = [obj[i][index]]
			lst.append(my_dict)
		
		dupe_list = []
		
		for i in range(len(lst) - 1):
			for j in range(i+1, len(lst)-1):
				if lst[i]['id'] == lst[j]['id']:
					for k in range(len(lst[i]['filePath'])):
						if lst[i]['filePath'][k] is not None:
							lst[j]['filePath'].append(lst[i]['filePath'][k])
							lst[i]['filePath'][k] = None
							dupe_list.append(i)
			
		new_lst = remove_dupes(dupe_list)
		final_lst = remove_indices(new_lst, lst)
		
		for i in range(len(final_lst)):
			print(i, final_lst[i])
		
		return final_lst

	
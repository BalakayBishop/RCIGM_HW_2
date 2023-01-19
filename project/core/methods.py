from project.models.models import User, UserFiles

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
	
def get_file(file_id):
	file = UserFiles.query.filter_by(id=file_id).one_or_none()
	if file is not None:
		return UserFiles.as_dict(file)
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
		for i in range(len(obj)):
			my_dict = {}
			for j in range(len(obj[i])):
				match j:
					case 0:
						my_dict['user_id'] = obj[i][j]
					case 1:
						my_dict['user_firstName'] = obj[i][j]
					case 2:
						my_dict['user_lastName'] = obj[i][j]
					case 3:
						my_dict['user_userName'] = obj[i][j]
					case 4:
						my_dict['files'] = [{'id': obj[i][j], 'path': obj[i][j+1]}]
			lst.append(my_dict)
		
		dupe_list = []
		
		for i in range(0, len(lst) - 1):
			for j in range(i+1, len(lst)-1):
				if lst[j]['user_id'] == lst[i]['user_id']:
					for k in range(0, len(lst[i]['files'])):
						if lst[i]['files'][k] is not None:
							lst[j]['files'].append(lst[i]['files'][k])
							lst[i]['files'][k]= None
							dupe_list.append(i)
		
		new_lst = remove_dupes(dupe_list)
		final_lst = remove_indices(new_lst, lst)
		
		# for i in range(len(final_lst)):
		# 	print(i, final_lst[i])
		# print()

		return final_lst

	
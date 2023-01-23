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
	
	
def convert_join(query):
	lst = list()
	i = 0
	if len(query) != 0:
		for obj in query:
			lst.append({"user_id": obj.user_id,"user_firstName": obj.first_name,"user_lastName": obj.last_name,"user_userName": obj.username,"files": []})
			for file in obj.files:
				lst[i]['files'].append({"file_id": file.file_id, "file_path": file.file_path})
			i += 1
		# for i in lst:
		# 	print(i)
		return lst
	return None

	
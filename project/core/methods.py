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
					my_dict['filePath'] = obj[i][index]
			lst.append(my_dict)
	for i in lst:
		print(i)
	return lst
	
	
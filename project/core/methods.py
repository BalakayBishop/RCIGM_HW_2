from project.models.models import User

def is_valid(username_check):
	usernameExist = User.query.filter_by(username=username_check).one_or_none()
	if usernameExist is None:
		return True
	elif usernameExist is not None:
		return False
	
def convert_join(query):
	lst = list()
	i = 0
	if len(query) != 0:
		for obj in query:
			lst.append({"user_id": obj.user_id,"user_firstName": obj.first_name,"user_lastName": obj.last_name,"user_userName": obj.username,"files": []})
			for file in obj.files:
				lst[i]['files'].append({"file_id": file.file_id, "file_name": file.file_name})
			i += 1
		# for i in lst:
		# 	print(i)
		return lst
	return None

	
import os 

dir_path = os.path.dirname(os.path.realpath(__file__))
os.system(f"cd {dir_path} && pdoc ../quantive/ --output-dir .")
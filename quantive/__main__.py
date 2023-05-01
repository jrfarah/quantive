"""
====================================

* **Filename**:         __main__.py 
* **Author**:              Joseph Farah 
* **Description**:       Main pipeline execution for QUANTIVE.

====================================

**Notes**
* This file can be run when quantive is installed via `python -m quantive`.
* Run  `python -m quantive options` to see a full list of options.
* It will activate the pipeline via `pipeline.py`.  
"""

#------------- IMPORTS -------------#
import os
import sys
import glob
import typing_filter

#------------- CLASSES -------------#
class _bcolors:
    '''
        Helper class to produce colored text.
    '''
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

    @staticmethod
    def warning(message):
        print (_bcolors.WARNING + "[" + message + "]" + _bcolors.ENDC)

    @staticmethod
    def success(message):
        print (_bcolors.OKGREEN + "[" + message + "]" + _bcolors.ENDC)

    @staticmethod
    def failure(message):
        print (_bcolors.FAIL + "[" + message + "]" + _bcolors.ENDC)




#------------- FUNCTIONS -------------#
def main():
    """
        Main function execution. Executes the QUANTIVE pipeline. 
        Options include: "options" (get a searchable list of options), "pipeline" (run the pipeline), "runtests" (run all unit tests) 

        **Args**:

        * none (none): none

        **Returns**:

        * none (none): none

    """
    dir_path = os.path.dirname(os.path.realpath(__file__))
    os.chdir(dir_path)

    if len(sys.argv) == 1:
        _bcolors.success("Starting the QUANTIVE pipeline.")
        os.system(f"python {dir_path}/pipeline.py")

    elif len(sys.argv) >= 2:

        if sys.argv[1] in ["options", "help"]:
            options = ['runtests', 'pipeline', 'makedocs', 'gencustom']
            descriptions = ['Run all unit testing to sweep for bugs.', 'Run the QUANTIVE pipeline.', 'Compile the documentation', 'Generate a custom.py file from template to implement your trading algorithm.']
            choice = typing_filter.launch(options, descriptions)
        else:
            choice = sys.argv[1]
        if choice == "runtests":
            tests_pys = glob.glob(f"{dir_path}/test/*.py")
            print(tests_pys)
            for testpy in tests_pys:
                os.system(f"cd {dir_path}/test/ && python {testpy}")
        elif choice == 'pipeline':
            _bcolors.success("Starting the QUANTIVE pipeline.")
            os.system(f"python {dir_path}/pipeline.py")
            # with open(f"{dir_path}/pipeline.py") as p:
            #     exec(p.read())
        elif choice == 'makedocs':
            os.system(f"cd {dir_path} && python ../docs/make.py")
            print("Documentation saved to docs/.")
        elif choice == 'gencustom':
            os.system(f"cd {dir_path} && cp .custom_template.py custom.py")
            print("Generated new algorithms file at quantive/custom.py.")




    
if __name__ == '__main__':
    main()
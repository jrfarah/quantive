"""
====================================

* **Filename**:         __main__.py 
* **Author**:              Joseph Farah 
* **Description**:       Main pipeline execution for QUANTIVE.

====================================

**Notes**
* This file can be run when quantive is installed via `python -m quantive`.
* It will activate the pipeline via `pipeline.py`.  
"""

#------------- IMPORTS -------------#
import os

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

        **Args**:

        * none (none): none

        **Returns**:

        * none (none): none

    """
    
    _bcolors.success("Starting the QUANTIVE pipeline.")
    with open("quantive/pipeline.py") as p:
        exec(p.read())
     

    
if __name__ == '__main__':
    main()
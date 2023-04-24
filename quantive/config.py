"""
====================================

* **Filename**:         config.py 
* **Author**:              Joseph Farah 
* **Description**:       Writes and reads custom quantive configuration files.

====================================
**Notes**
*  
"""

#------------- IMPORTS -------------# 
import os
import typing_filter
from tqdm import tqdm
from typing import Union


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



class ConfigurationObject(object):

    """
    Object to write and read configuration files. 
    Object of this type will be passed to pipeline as settings. 
    """

    def __init__(self, config_file: Union[str, dict]):

        self.config = config_file
        """ Configuration file or dictionary"""

        if type(self.config) is str:
            self.config = self.load(self.config)


    def load(self, _fpath: str) -> dict:
        """
            Load in a configuration file from a filepath.
        
            **Args**:
        
            * _fpath (str): Path to configuration file.
        
            **Returns**:
        
            * config_dict (dict): Dictionary containing config settings
        
        """
        
        ## open file ##
        with open(_fpath, "r") as file_object:
            lines = file_object.readlines()

        ## construct dictionary ##
        config_dict = {}
        _bcolors.warning("Loading in configuration file.")
        for line in tqdm(lines):

            ## check if line is comment ##
            cleaned_line = line.strip('\n').strip()
            if cleaned_line[0] in ["#", "@", "!"]:
                continue

            values = cleaned_line.split(":")
            if values[0] not in list(config_dict.keys()):
                config_dict[values[0]] = {}

            config_dict[values[0]][values[1]] = values[2]

        _bcolors.success("Loaded.")
        return config_dict


#------------- FUNCTIONS -------------#
def main():
    """
        Test load and editing of config file.
    
        **Args**:
    
        * none (none): none
    
        **Returns**:
    
        * none (none): none
    
    """
    
    config = ConfigurationObject("./example.config")
    print(config.config)


#------------- switchboard -------------#
if __name__ == '__main__':
     main() 
    
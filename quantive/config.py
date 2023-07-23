"""
====================================

* **Filename**:         config.py 
* **Author**:              Joseph Farah 
* **Description**:       Writes and reads custom quantive configuration files.

====================================

**Notes**

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
        for line in lines:

            ## check if line is comment ##
            cleaned_line = line.strip('\n').strip()
            if len(cleaned_line) < 2 or cleaned_line[0] in ["#", "@", "!"]:
                continue

            values = cleaned_line.split(":")
            if values[0] not in list(config_dict.keys()):
                config_dict[values[0]] = {}

            config_dict[values[0]][values[1]] = values[2]

        _bcolors.success("Loaded.")
        return config_dict


    def update_key(self, group: str, key: str, new_value: str):
        """
            Update a key in the configuration with a new value. 
            Modifies the configuration object in place.
        
            **Args**:
            
            * group (str): group (e.g., CONNECT, BUY, etc)
            * key (str): existing key to update
            * new_value (str): new value corresponding to key

        
            **Returns**:
        
            * none (none): none
        
        """

        if group not in list(self.config.keys()):
            self.config[group] = {}

        self.config[group][key] = new_value


    def add_key(self, group: str, key: str, value: str):
        """
            Adds a setting to the configuration.
        
            **Args**:
        
            * key (str): new key to add 
            * value (str): new value corresponding to key
        
            **Returns**:
        
            * none (none): none
        
        """
        
        self.update_key(group, key, value)

    def remove_key(self, group: str, key: str):
        """
            remove setting from the configuration.  
        
            **Args**:
        
            * group (str): group (e.g., CONNECT, BUY, etc)
            * key (str): existing key to remove. Put NONE to remove
            entire group.
        
            **Returns**:
        
            * none (none): none
        
        """

        if key is not None:
            del self.config[group][key]
        else:
            del self.config[group]
    
    def save(self, _output_fpath: str):
        """
            Saves the configuration to a file.
        
            **Args**:
        
            * _output_fpath (str): filepath of the saved config
        
            **Returns**:
        
            * none (none): none
        
        """

        with open(_output_fpath, "w") as output:

            for g in list(self.config.keys()):

                for key in list(self.config[g].keys()):
                    save_str = f"{g}:{key}:{self.config[g][key]}\n"
                    output.write(save_str)

        _bcolors.success("File saved.")
         
        
        
    def print_group(self, group):
        """
            Prints the current configuration file
            
            **Args**:

            * group (str): group (e.g., CONNECT, BUY, etc)
            * key (str): existing key to remove. Put NONE to remove
            entire group.
        
            **Returns**:
        
            The current configuration groups
        
        """      

        #KeyValue = self.config[group][key]
        
        GroupValue = self.config[group]

        GroupValueLength = len(GroupValue)
        for i in range(0, GroupValueLength):
            GroupKeys = dict(list(GroupValue.items())[i:i+1])
            GroupKeysString = str(GroupKeys)
            GroupKeysStringReplace = GroupKeysString.replace("'", '')
            print((GroupKeysStringReplace)[1:-1])


        return GroupValue #format of the group
        
         
        


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
    config.add_key("CONNECT", "testkey", "testval")
    print(config.config)


#------------- switchboard -------------#
if __name__ == '__main__':
     main() 
    
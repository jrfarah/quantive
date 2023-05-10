"""
====================================

* **Filename**:         pipeline.py 
* **Author**:              Joseph Farah 
* **Description**:       The main QUANTIVE pipeline. Brings all the 
modules together into one cohesive functionality. Additionally serves
as an example for how QUANTIVE can be used by you, if you wish to construct
your own pipeline.

====================================

**Notes**
* Under active development. This pipeline is not a substitute for 
the unit testing. 
"""

#------------- IMPORTS -------------#
import os
import typing_filter
import tqdm
import glob
import time
from datetime import datetime

import sys
sys.path.append(os.path.dirname(os.path.realpath(__file__)))

from config import ConfigurationObject
from monitor.connect_exchange import Exchange 


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
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print ( "\n\n" + current_time + " " +_bcolors.WARNING + "[" +  message + "]" + _bcolors.ENDC)

    @staticmethod
    def success(message):
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print ("\n\n" + current_time + " " +_bcolors.OKGREEN + "[" +  message + "]" + _bcolors.ENDC)

    @staticmethod
    def failure(message):
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print ("\n\n" + current_time + " " + _bcolors.FAIL + "[" +  message + "]" + _bcolors.ENDC)



#------------- FUNCTIONS -------------#
def main():
    """
        Main pipeline execution. This is the hub from which the
        other modules are called. MONITOR/BUY/SELL/RECORD will
        be controlled from here.
    
        **Args**:
    
        * none (none): none
    
        **Returns**:
    
        * none (none): none
    
    """

    DIR_PATH = os.path.dirname(os.path.realpath(__file__))


    ## intro ##
    with open(f"{DIR_PATH}/logo.txt", "r") as logo:
        logo = logo.readlines()

    for line in logo:
        time.sleep(0.1)
        print(line, end="")
    
    input("\n\nWelcome to QUANTIVE, the free and open-source trading software. Press any key to continue.")

    ## load configuration ##
    configs = glob.glob("./*.config")
    if len(configs) > 1:
        print(f"{len(configs)} configuration files found in the current directory. Which would you like to use?")
        config_choice = typing_filter.launch(configs, header=f"{len(configs)} configuration files found in the current directory. Which would you like to use?")
    elif len(configs) == 1:
        config_choice = config[0]
        print(f"Using {config_choice}, the only configuration file found in this folder.")
    elif len(configs) == 0:
        _bcolors.failure("No configuration file found. Quitting.")
        return 1


    ## extract configuration parameters ##
    config_o = ConfigurationObject(config_choice)
    _bcolors.success("Loaded your chosen configuration file.")

    exchange_id = config_o.config['CONNECT']['exchange']
    APIkey      = config_o.config['CONNECT']['apikey']
    APIsecret   = config_o.config['CONNECT']['apisecret']
    trading     = config_o.config['CONNECT']['trading']
    tickers     = config_o.config['MONITOR']['tickers'].split(',')
    algo_path   = config_o.config['ALGO']['filepath']
    endofday    = config_o.config['SELL']['endofday']

    ## create exchange object ##
    exchange_object = Exchange(exchange=exchange_id, apikey=APIkey, apisecret=APIsecret, base_url=None, trading=trading)

    exchange_object.print_account()

    








    


#------------- switchboard -------------#
if __name__ == '__main__':
    main()
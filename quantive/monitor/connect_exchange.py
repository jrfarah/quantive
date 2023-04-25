"""
====================================

* **Filename**:         connect_exchange.py 
* **Author**:              Joseph Farah 
* **Description**:       Various tools for connecting to exchanges.

====================================

**Notes**
* We will be starting with Alpaca trade API and add more exchanges as time allows. 
"""

#------------- IMPORTS -------------# 
import alpaca_trade_api as alpaca


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



class Exchange(object):
    """
    A generic exchange class. This class will unify the different 
    function calls across APIs, so you don't have to change your code to 
    use a different exchange.   

    """

    def __init__(self, exchange=None, apikey=None, apisecret=None, base_url=None, trading=None):

        self.exchange = exchange
        """ The exchange targeted for connection """
        self.APIkey = apikey
        """ The API key needed to connect to the exchange """
        self.APIsecret = apisecret
        """ The API secret needed to connect to the exchange """
        self.base_url = base_url
        """ Some APIs need a particular URL to connect to, e.g., for paper trading """
        self.trading = trading
        """ trading type; either paper or real """


        self.parameters = {
            'exchange':self.exchange,
            'APIkey':self.APIkey,
            'APIsecret':self.APIsecret,
            'base_url':self.base_url
        }
        """ parameters dictionary to access any combination of kwargs """


        ## create api object ##
        self.api = None
        """the API attribute, used for directly interfacing with exchange"""

        if self.exchange == 'alpaca':
            if self.base_url is not None and self.trading is not None:
                _bcolors.warning("Both self.BASE_URL and self.TRADING provided. Defaulting to self.BASE_URL")
            elif self.trading.lower() == 'paper':
                self.base_url = 'https://paper-api.alpaca.markets'
            elif self.trading.lower() == 'real':
                self.base_url = 'https://api.alpaca.markets'

            self.api = alpaca.REST(key_id=self.APIkey, secret_key=self.APIsecret, base_url=self.base_url)
        else:
            bcolors.failure("Unknown exchange. Exchange class will not function properly.")

        ## grab account information ##
        self.account = None
        if self.exchange == 'alpaca' and self.api:
            self.account = self.api.get_account()


    def print_account(self):
        """
            Print account information for debugging purposes.
        
            **Args**:
        
            * none (none): none
        
            **Returns**:
        
            * none (none): none
        
        """
        
        print(f"Account information for exchange {self.exchange}:")
        print("============================")
        print(self.account)
        print("============================")


    def buy(self, ticker: str, quantity: float, price: float, spend: float, order_type='market', time_in_force='gtc'):
        """
            General API buy. This will check the API and apply the correct buy function.        
        
            **Args**:
        
            * ticker (str): the stock to buy (e.g., AAPL)
            * quantity (float): how many shares to buy
            * price (float): price of a single share
            * spend (float): how much to spend on this buy
        
            **Returns**:
        
            * return1 (type): return description
        
        """

        shares_from_spend = spend / price
        quantity = min([quantity, shares_from_spend])

        if self.exchange == 'alpaca':
            api.submit_order(
              symbol=ticker, # Replace with the ticker of the stock you want to buy
              qty=quantity,
              side='buy',
              type=order_type, 
              time_in_force=time_in_force # Good 'til cancelled
            )


    def sell(self, ticker: str, quantity: float, price: float, spend: float, order_type='market', time_in_force='gtc'):
        """
            General API sell. This will check the API and apply the correct sell function.        
        
            **Args**:
        
            * ticker (str): the stock to buy (e.g., AAPL)
            * quantity (float): how many shares to buy
            * price (float): price of a single share
            * spend (float): how much to spend on this buy
        
            **Returns**:
        
            * return1 (type): return description
        
        """

        if self.exchange == 'alpaca':
            api.submit_order(
              symbol=ticker, # Replace with the ticker of the stock you want to buy
              qty=quantity,
              side='sell',
              type=order_type, 
              time_in_force=time_in_force # Good 'til cancelled
            )


    # def sell_all(self, ticker: str, order_type='market', time_in_force='gtc'): ## TODO


        


        

        





#------------- functions -------------#
def main():
    """
        Testing of various APIs.
    
        **Args**:
    
        * none (none): none
    
        **Returns**:
    
        * none (none): none
    
    """
     
    return


#------------- switchboard -------------#
if __name__ == '__main__':
    main()
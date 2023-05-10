import sys
sys.path.append('../')

from config import ConfigurationObject
from monitor import connect_exchange
import unittest

config_o = ConfigurationObject("../TEST_config.config")
exchange_id = config_o.config['CONNECT']['exchange']
APIkey      = config_o.config['CONNECT']['apikey']
APIsecret   = config_o.config['CONNECT']['apisecret']
trading     = config_o.config['CONNECT']['trading']
tickers     = config_o.config['MONITOR']['tickers'].split(',')
algo_path   = config_o.config['ALGO']['filepath']
endofday    = config_o.config['SELL']['endofday']



class TestMonitor(unittest.TestCase):

    def test_getprice(self):
        exchange_object = connect_exchange.Exchange(exchange=exchange_id, apikey=APIkey, apisecret=APIsecret, base_url=None, trading=trading)
        self.assertTrue(exchange_object.get_quote("AAPL") is not None)
        print(exchange_object.get_quote("AAPL"))



if __name__ == '__main__':
    unittest.main()
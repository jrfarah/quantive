"""
Construct your algorithm in this file. The pipeline will load in 
prebuy_monitor() and presell_monitor() in order to execute your strategy.
You can use any Python logic you like and include in any other tools you want.


""" 


#------------- imports -------------#
import os
import sys
sys.path.append(os.path.dirname(os.path.realpath(__file__)))

import monitor
import analysis

import time


#------------- prebuy-monitor -------------#
def prebuy_monitor(tickers, exchange):

    ## your code goes here. Use the monitor and analysis tools
    ## to construct your strategy!

    lowest_ticker_price, best_ticker = 1e9, None
    for ticker in tickers:

        ticker_price = float(exchange.api.get_quote(ticker))
        if ticker_price < lowest_ticker_price:
            lowest_ticker_price = ticker_price
            best_ticker = ticker

    return best_ticker



#------------- presell-monitor -------------#
def presell_monitor(tickers, exchange):

    ## your code goes here. Use the monitor and analysis tools
    ## to construct your strategy!
    
    print("Waiting 10 seconds...")
    time.sleep(10)


    
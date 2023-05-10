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


#------------- prebuy-monitor -------------#
def prebuy_monitor(tickers, exchange):

    ## your code goes here. Use the monitor and analysis tools
    ## to construct your strategy!

    lowest_ticker_price, best_ticker = 1e9, None
    for ticker in tickers:

        ticker_price = float(exchange.api.get_last_quote(ticker)['askprice'])
        if ticker_price < lowest_ticker_price:
            lowest_ticker_price = ticker_price
            best_ticker = ticker

    if lowest_ticker_price < exchange.



#------------- presell-monitor -------------#
def presell_monitor(tickers, exchange):

    ## your code goes here. Use the monitor and analysis tools
    ## to construct your strategy!
    
    return 
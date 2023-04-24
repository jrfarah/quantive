import sys
sys.path.append('../')

from config import ConfigurationObject

import unittest

class TestConfigMethods(unittest.TestCase):

    def test_load(self):
        config_obj = ConfigurationObject("../example.config")
        self.assertEqual(config_obj.config['CONNECT']['apikey'], 'KEY')


if __name__ == '__main__':
    unittest.main()
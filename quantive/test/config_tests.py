import sys
sys.path.append('../')

from config import ConfigurationObject
import unittest

class TestConfigMethods(unittest.TestCase):

    def test_load(self):
        config_obj = ConfigurationObject("../example.config")
        self.assertEqual(config_obj.config['CONNECT']['apikey'], 'KEY')

    def test_add(self):
        config_obj = ConfigurationObject("../example.config")
        config_obj.add_key("CONNECT", "testkey", "testval")
        self.assertEqual(config_obj.config["CONNECT"]['testkey'], "testval")

    def test_remove(self):
        config_obj = ConfigurationObject("../example.config")
        length = len(config_obj.config['CONNECT'])
        config_obj.add_key("CONNECT", "testkey", "testval")
        self.assertEqual(length+1,  len(config_obj.config['CONNECT']))

    def test_remove_save(self):
        config_obj = ConfigurationObject("../example.config")
        config_obj.add_key("CONNECT", "testkey2", "testval2")
        config_obj.save("../example.config")
        config_obj = ConfigurationObject("../example.config")
        self.assertEqual(config_obj.config["CONNECT"]['testkey2'], "testval2")

    def test_print_group(self):
        config_obj = ConfigurationObject("../example.config")
        config_obj.add_key("CONNECT", "testkey2", "testval2")
        config_obj.save("../example.config")
        config_obj = ConfigurationObject("../example.config")
        test = config_obj.print_group("CONNECT")
        self.assertEqual(test, {'exchange': 'alpaca', 'apikey': 'KEY', 'apisecret': 'SECRET', 'testkey2': 'testval2'})


if __name__ == '__main__':
    unittest.main()
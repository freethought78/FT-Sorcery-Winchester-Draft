import os
import sys
import string
import random
import urllib.request
from csv import DictReader
from hashlib import sha256

def handle(data):
    key = next(iter(data))
    value = data[key]

    if key == 'connect':
        message = {'state': draft.state}
        return message

    if key == 'config_data':
        if value['user'] == draft.hostID:
            draft.generate_cube(draft.master_card_list, int(value['cube_size']))
            draft.initialize_draft_state()

            message = {'state': draft.state}
            return message

        else: print('invalid config change attempt detected')

def get_hash(un_hashed):
    return sha256(un_hashed.encode('utf-8')).hexdigest()


class Draft:
    def __init__(self):
        self.master_card_list = self.load_cards()
        self.cube = []
        self.phase = 'configuration'
        self.IP = self.get_external_ip()
        self.hostID = self.generate_ID()
        self.clientID = self.generate_ID()
        self.secure_hostID = get_hash(self.hostID)
        self.secure_clientID = get_hash(self.clientID)
        self.turn = self.secure_hostID
        self.state = {
            'phase': 'configuration'
        }

    def load_cards(self):
        # Determine base path
        if getattr(sys, 'frozen', False):
            base_path = sys._MEIPASS  # Running as a bundled executable
        else:
            base_path = os.path.abspath(os.path.dirname(__file__))  # Running as a script

        csv_path = os.path.join(base_path, 'beta.csv')  # Ensure correct path

        with open(csv_path, 'r', encoding='utf-8') as f:
            dict_reader = DictReader(f)
            master_card_list = list(dict_reader)
            return master_card_list

    def generate_cube(self, card_list, cube_size):
        self.cube = random.choices(card_list, k=cube_size)

    def next_draft_round(self):
        for col in self.state['draft_columns']:
            col.append(self.cube.pop())

    def initialize_draft_state(self):
        self.phase = 'draft'
        state = {
            'draft_columns': [[], [], [], []],
            'phase': self.phase,
            'host': self.secure_hostID,
            'client': self.secure_clientID,
            'turn': self.secure_hostID
        }
        self.turn = self.secure_hostID
        self.state = state
        self.next_draft_round()
        self.next_draft_round()
        self.next_draft_round()
        self.next_draft_round()
        self.next_draft_round()
        self.next_draft_round()
        self.next_draft_round()
        self.next_draft_round()


    def get_external_ip(self):
        return urllib.request.urlopen('https://ident.me').read().decode('utf8')

    def generate_ID(self, size=6):
        return ''.join(random.choices(string.ascii_letters, k=size))


draft = Draft()
print (draft.secure_hostID)
os.system(f'explorer "http://{draft.IP}?id={draft.hostID}"')


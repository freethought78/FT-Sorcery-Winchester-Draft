import os
import sys
import string
import random
import urllib.request, urllib.parse
import json
import webbrowser
import SessionData

def handle(data):
    key = next(iter(data))
    value = data[key]

    if key == 'connect':
        if value['user'] == draft.clientID and draft.phase == 'await_client':
            print('guest connected')
            draft.initialize_draft_state()
        message = {'state': draft.state}
        return message

    if key == 'config_data':
        if value['user'] == draft.hostID:
            draft.cube_size = int(value['cube_size'])
            draft.set_phase('await_client')
            draft.state['clientID'] = draft.clientID
            draft.state['IP'] = draft.IP
            message = {'state': draft.state}
            return message

        else: print('invalid config change attempt detected')

    if key == 'select_column':
        if value['user'] == draft.turn:
            if value['user'] == draft.hostID: target = draft.host_cards
            else: target = draft.client_cards
            source = draft.state['draft_columns'][value['column']]
            target.extend(source)
            source.clear()
            return draft.next_draft_round()

#this makes sure that file paths work when running from source and when running from a pyinstaller package
if getattr(sys, 'frozen', False):
    base_path = sys._MEIPASS  # Running as a bundled executable
else:
    base_path = os.path.abspath(os.path.dirname(__file__))  # Running as a script

class Draft:
    def __init__(self):
        self.master_card_list = self.load_cards()
        self.host_cards = []
        self.client_cards = []
        self.cube = []
        self.cube_size = 0
        self.IP = self.get_external_ip()
        self.hostID = self.generate_ID()
        self.clientID = self.generate_ID()
        self.turn = self.hostID
        self.state = {}
        self.set_phase('configuration')
        self.generate_session()

    def generate_session(self):


        client_data = json.dumps({"IP": self.IP, "ID": self.clientID})
        host_data = json.dumps({"IP": self.IP, "ID": self.hostID})

        key = self.generate_ID(32)
        session = self.generate_ID(256)
        self.client_session = key + SessionData.encrypt(session+client_data, key)
        key = self.generate_ID(32)
        session = self.generate_ID(256)
        self.host_session = key + SessionData.encrypt(session+host_data, key)
        self.state['session'] = self.client_session
        print(session)
        return session


    def load_cards(self):
        path = os.path.join(base_path, 'Alpha-Beta.json')
        with open(path, 'r+', encoding='utf-8') as f:
            card_list = json.load(f)
            master_card_list = []
            for card in card_list['spellbook']: master_card_list.append(card)
            for card in card_list['atlas']: master_card_list.append(card)
            for card in card_list['sideboard']: master_card_list.append(card)

            for card in master_card_list:
                if card['name'] == 'Sorcerer': card['src'] = card['src'].replace('/alp/', '/bet/')
                if '/alp/' in card['src']: card['set'] = 'alpha'
                if '/bet/' in card['src']: card['set'] = 'beta'

        path = os.path.join(base_path, 'Arthurian Legends.json')
        with open(path, 'r+', encoding='utf-8') as f:
            card_list = json.load(f)
            for card in card_list['spellbook']:
                card['set'] = 'arthurian legends'
                master_card_list.append(card)
            for card in card_list['atlas']:
                card['set'] = 'arthurian legends'
                master_card_list.append(card)
            for card in card_list['sideboard']:
                card['set'] = 'arthurian legends'
                master_card_list.append(card)

        return master_card_list

    def generate_cube(self, card_list, cube_size):
        self.cube = random.choices(card_list, k=cube_size)

    def next_draft_round(self):
        for col in self.state['draft_columns']:
            col.append(self.cube.pop())
        if self.turn == self.hostID:
            self.turn = self.clientID
            self.state['turn'] = self.clientID
        else:
            self.turn = self.hostID
            self.state['turn'] = self.hostID

        return {"state": self.state}

    def initialize_draft_state(self):
        draft.generate_cube(draft.master_card_list, draft.cube_size)
        state = {
            'draft_columns': [[], [], [], []],
            'turn': self.clientID,
        }

        self.turn = self.clientID
        self.state = state
        self.set_phase('draft')
        self.next_draft_round()

    def set_phase(self, phase):
        self.phase = phase
        self.state['phase'] = self.phase

    def get_external_ip(self):
        return urllib.request.urlopen('https://ident.me').read().decode('utf8')

    def generate_ID(self, size=6):
        return ''.join(random.choices(string.ascii_letters, k=size))


draft = Draft()
base_url = 'freethought78.github.io/FT-Sorcery-Winchester-Draft/public/index.html'


local_test = False

if local_test:
    url = f"https://{draft.IP}?session={draft.host_session}&localtest=true"
else:
    url = f"https://{base_url}?session={draft.host_session}"

webbrowser.open(url)
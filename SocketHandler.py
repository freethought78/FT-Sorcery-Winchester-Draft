import os
import sys
from csv import DictReader
import random


def handle(data):
    key = next(iter(data))
    value = data[key]

    message = {"message": "Hello from server!"}

    if key == 'connect': message = {'state': draft.state}

    #print("this is the data we got: " + data["message"])
    return message

class Draft:
    def __init__(self):
        self.master_card_list = self.load_cards()
        self.cube = self.generate_cube(self.master_card_list)
        self.state = self.initializeDraftState()
        self.next_draft_round()

    def load_cards(self):
        # Determine base path
        if getattr(sys, 'frozen', False):
            base_path = sys._MEIPASS  # Running as a bundled executable
        else:
            base_path = os.path.abspath(os.path.dirname(__file__))  # Running as a script

        csv_path = os.path.join(base_path, 'beta.csv')  # Ensure correct path

        with open(csv_path, 'r') as f:
            dict_reader = DictReader(f)
            master_card_list = list(dict_reader)
            return master_card_list

    def generate_cube(self, card_list):
        cube = random.choices(card_list, k=100)
        return cube

    def next_draft_round(self):
        for col in self.state['draft_columns']:
            col.append(self.cube.pop())

    def initializeDraftState(self):
        state = {}
        state['draft_columns'] = [[],[],[],[]]
        return state


draft = Draft()
print(draft.state)
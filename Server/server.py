from flask import Flask, request
from flask_cors import cross_origin
import json
import tensorflow as tf
import tensorflow.keras as keras
import numpy as np


app = Flask(__name__)

@app.route('/')
def give_output():
	print('Running')
	return 'Welcome Mr. Gupta'

def give_mapping(cell_locs):
	mapping = np.zeros((11,11))
	for cell in cell_locs:
		mapping[int(cell[0]*10), int(cell[1]*10)] = 1

	return mapping

def give_steps(curr_data):
	global prev_steps
	ob_assist = prev_steps
	ob_assist.append(curr_data)
	ob_assist = np.array(ob_assist)[np.newaxis]
	asst_probs = asst_model([ob_assist, env_cell_mapping])
	asst_action = np.argmax(np.squeeze(asst_probs)) + 1
	prev_steps = np.squeeze(ob_assist).tolist()[-5:]
	return asst_action


def give_new_state(steps, coords, dirc):
	if np.argmax(dirc) == 0:
		dirc = np.array([0, -1])

	elif np.argmax(dirc) == 1:
		dirc = np.array([0, 1])

	elif np.argmax(dirc) == 2:
		dirc = np.array([-1, 0])

	elif np.argmax(dirc) == 3:
		dirc = np.array([1, 0])

	
	curr_loc = np.array(coords)
	new_loc = curr_loc*10 + dirc*steps

	new_loc[0] = min(new_loc[0], 10)
	new_loc[0] = max(new_loc[0], 0)
	new_loc[1] = min(new_loc[1], 10)
	new_loc[1] = max(new_loc[1], 0)

	return new_loc.tolist()


@app.route("/give_ans" ,methods=['POST'])
@cross_origin()
def test():
	print('In test')
	global prev_steps
	
	data = request.get_json()
	
	if data['done']:
		# prev_steps = give_default_steps(prev_steps)
		print(id(prev_steps))
		prev_steps[0] = [0,0,0,0,-1,-1]
		prev_steps[1] = [0,0,0,0,-1,-1]
		prev_steps[2] = [0,0,0,0,-1,-1]
		prev_steps[3] = [0,0,0,0,-1,-1]
		prev_steps[4] = [0,0,0,0,-1,-1]

		print(id(prev_steps))
		print(prev_steps)
		ans = data['arr'][-2:]
		ans[0] = ans[0]*10
		ans[1] = ans[1]*10
		return {'ans' : ans}

	ans = give_steps(data['arr'])
	print('\n\n\n')
	print(prev_steps)	
	print(ans)
	print('\n\n\n')
	state = give_new_state(ans, data['arr'][-2:], data['arr'][:4])
	return {'state' : state}
	


def give_default_steps(prev_steps):
	print('Resetting')
	prev_steps[0] = [0,0,0,0,-1,-1]
	prev_steps[1] = [0,0,0,0,-1,-1]
	prev_steps[2] = [0,0,0,0,-1,-1]
	prev_steps[3] = [0,0,0,0,-1,-1]
	prev_steps[4] = [0,0,0,0,-1,-1]
	return prev_steps

if __name__ == '__main__':
	asst_model = tf.keras.models.load_model('asst.h5')
	prev_steps = give_default_steps([[], [], [], [], []])
	env_cell_mapping = give_mapping([[0, 0], [1, 1], [0, 1], [1, 0], [0.5, 0.3], [0.5, 0.7]])
	env_cell_mapping = env_cell_mapping[np.newaxis, :, :, np.newaxis]
	app.run(debug = True)
	

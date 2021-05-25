import numpy as np
from collections import deque

class Replay_Buffer:
	def __init__(self, len_buffer):
		self.states = deque([], maxlen=len_buffer)
		self.next_states = deque([], maxlen=len_buffer)
		self.rewards = deque([], maxlen=len_buffer)
		self.dones = deque([], maxlen=len_buffer)

	def append(self, state, reward, next_state, done):
		self.states.append(state)
		self.rewards.append(reward)
		self.next_states.append(next_state)
		self.dones.append(done)

	def clear(self):
		self.states.clear()
		self.next_states.clear()
		self.rewards.clear()
		self.dones.clear()


class Environment:
	def __init__(self, loc_icons=None, num_icons=None, usage_prob=None):
		'''Initializes the location of icons and rescales btw 0 and 1'''
		if loc_icons is None:
			if num_icons is None:
				self.cells = np.random.randint(low=0, high=10, size=(6, 2))/10
			else:
				self.cells = np.random.randint(
					low=0, high=10, size=(num_icons, 2))/10

		else:
			self.cells = np.array(loc_icons)/10

		if usage_prob is not None:
			self.usage_prob = np.array(usage_prob)
		else:
			self.usage_prob = np.array(
				[1/self.cells.shape[0]]*self.cells.shape[0])

		print('Icon Locations:')	
		print(self.cells)
		print('Icon usage Probabilities')
		print(self.usage_prob)


	def give_start_dest(self):
		dest_loc = self.cells[np.random.choice(self.cells.shape[0], p = self.usage_prob), :]
		start_loc = dest_loc[:]
		while np.equal(start_loc, dest_loc).all():
			start_loc = np.random.randint(low = 0, high = 10, size = (2,))/10

		return start_loc, dest_loc


	def step(self, action_user, action_mod, target_loc, curr_loc):
		'''Action of user : 0:left = [-1, 0], 1:right = [1,0], 2:up = [0,-1], 3:down = [0, 1]
				Action of modulator = 1,2,3,4
		'''
		if action_user==0:
			action_user = [-1, 0]
		elif action_user==1:
			action_user = [1, 0]
		elif action_user==2:
			action_user = [0, -1]
		elif action_user==3:
			action_user = [0, 1]

		action_user = np.array(action_user)	
		new_loc = curr_loc + action_user*action_mod/10
		reward = -0.2 - np.sum(np.abs(target_loc - new_loc))

		if np.equal(new_loc, target_loc).all():
			done = 1
			reward+=10
		else:
			done = 0

		return new_loc, reward, done


if __name__ == '__main__':
	env = Environment()
	action_user = 1
	action_mod = 2

	curr_loc, target_loc = env.give_start_dest()
	print(curr_loc, target_loc)
	print(env.step(action_user, action_mod, target_loc, curr_loc))


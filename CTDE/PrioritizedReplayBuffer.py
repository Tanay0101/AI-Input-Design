from collections import deque
import numpy as np

class ReplayBuffer:
	def __init__(self, replay_buffer_size):
		self.ob_user_history = deque(maxlen=replay_buffer_size)
		self.action_user_history = deque(maxlen=replay_buffer_size)
		self.reward_user_history = deque(maxlen=replay_buffer_size)
		self.next_ob_user_history = deque(maxlen=replay_buffer_size)
		self.ob_assist_history = deque(maxlen=replay_buffer_size)
		self.action_assist_history = deque(maxlen=replay_buffer_size)
		self.reward_assist_history = deque(maxlen=replay_buffer_size)
		self.next_ob_assist_history = deque(maxlen = replay_buffer_size)
		self.done_history = deque(maxlen=replay_buffer_size)
		self.priorities = deque(maxlen = replay_buffer_size)
		self.max_val = 1

	def get_probabilities(self, priority_scale = 0.7):
		scaled_priorites = np.array(self.priorities)**priority_scale
		sample_probabilties = scaled_priorites/sum(scaled_priorites)
		return sample_probabilties

	def get_importance(self, probabilities):
		importance = 1/len(self.done_history) * 1/probabilities
		importance_normalized = importance/max(importance)
		return importance_normalized

	def set_priorities(self, indices, error, offset = 0.1):
		for i, e in zip(indices, error):
			self.priorities[i] = abs(e) + offset
			self.max_val = max(self.max_val, self.priorities[i])	
		return None



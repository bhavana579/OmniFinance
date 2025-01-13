import yfinance as yf
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from datetime import date
import matplotlib.pyplot as plt

# Download the data
symbol = '^GSPC'  # S&P 500 Index
start_date = '2010-01-01'
end_date = date.today().strftime("%Y-%m-%d")
df = yf.download(symbol, start=start_date, end=end_date)

# Prepare the data
data = df['Close'].values
data = data.reshape(-1, 1)

# Scale the data
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(data)

# Create the training dataset
train_length = int(len(scaled_data) * 0.8)
train_data = scaled_data[:train_length]
test_data = scaled_data[train_length:]

# Create sequences
def create_sequences(data, seq_length):
    x, y = [], []
    for i in range(seq_length, len(data)):
        x.append(data[i-seq_length:i])
        y.append(data[i, 0])
    return np.array(x), np.array(y)

seq_length = 50
x_train, y_train = create_sequences(train_data, seq_length)
x_test, y_test = create_sequences(test_data, seq_length)

# Reshape the data to be accepted by the LSTM
x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))
x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

# Build the model
model = Sequential()
model.add(LSTM(50, return_sequences=True, input_shape=(x_train.shape[1], 1)))
model.add(LSTM(50, return_sequences=False))
model.add(Dense(25))
model.add(Dense(1))

# Compile the model
model.compile(optimizer='adam', loss='mean_squared_error')

# Train the model
model.fit(x_train, y_train, batch_size=1, epochs=1)

# Save the model
model.save('stock_price_model.h5')

# Predicting and plotting (optional)
predictions = model.predict(x_test)
predictions = scaler.inverse_transform(predictions)

plt.figure(figsize=(16, 8))
plt.plot(df['Close'][train_length:].values, color='black', label='Actual Prices')
plt.plot(range(seq_length, seq_length + len(predictions)), predictions, color='blue', label='Predicted Prices')
plt.xlabel('Date')
plt.ylabel('Stock Price')
plt.legend()
plt.show()

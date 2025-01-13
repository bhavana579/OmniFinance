from flask import Flask, request, render_template
import yfinance as yf
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model
from datetime import date

app = Flask(__name__)

# Load the trained model
model = load_model("stock_price_model.h5")

# Function to get stock data
def get_data(stock, start_date, end_date):
    df = yf.download(stock, start=start_date, end=end_date)
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(df['Close'].values.reshape(-1, 1))
    return df, scaled_data, scaler

def create_sequences(data, seq_length):
    x = []
    for i in range(seq_length, len(data)):
        x.append(data[i-seq_length:i])
    return np.array(x)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        company_name = request.form['company']
        # Validate company name with ticker
        try:
            stock_symbol = yf.Ticker(company_name).info['symbol']
        except KeyError:
            return render_template('index.html', error="Company not found")

        start_date = '2019-01-01'
        end_date = date.today().strftime("%Y-%m-%d")
        df, scaled_data, scaler = get_data(stock_symbol, start_date, end_date)

        seq_length = 50
        x_test = create_sequences(scaled_data, seq_length)
        x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))
        predictions_scaled = model.predict(x_test)
        predictions = scaler.inverse_transform(predictions_scaled)

        plt.figure(figsize=(16, 8))
        plt.plot(df['Close'].values, color='black', label='Actual Prices')
        plt.plot(range(seq_length, seq_length + len(predictions)), predictions, color='blue', label='Predicted Prices')
        plt.xlabel('Date')
        plt.ylabel('Stock Price')
        plt.legend()
        plt.savefig('static/prediction.png')
        plt.close()

        last_closing_price = df['Close'].values[-1]
        predicted_next_day_price = predictions[-1][0]

        return render_template('index.html', 
                               company=company_name, 
                               last_closing_price=last_closing_price, 
                               predicted_next_day_price=predicted_next_day_price, 
                               img='static/prediction.png')

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)


from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

model = joblib.load("fraud_model.pkl")

@app.route("/predict", methods= ["POST"])
def predict():
    data = request.json
    features = [data.get("amount"), data.get("time_diff"), data.get("transaction_count")]
    features_array = np.array(features).reshape(1, -1)



    prediction = model.predict(features_array)
    probability = model.predict_proba(features_array)

    return jsonify({
        'prediction': int(prediction[0]),
        'probability' : probability.tolist()[0]

    })

if __name__ == "main":
    app.run(host= "0.0.0.0", port = 5000)
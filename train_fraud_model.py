import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import joblib


df = pd.read_csv('creditcard.csv')



X = df.drop("Class", axis =1)
y = df["Class"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)                                                                                                                                                                                                                                                     
model = LogisticRegression(max_iter = 1000, class_weight='balanced')
model.fit(X_train, y_train)

prediction = model.predict(X_test)
print("Accuracy:" , accuracy_score(y_test, prediction))
print("Classiication Report:\n", classification_report(y_test, prediction))

joblib.dump(model, 'fraud_model.pkl')
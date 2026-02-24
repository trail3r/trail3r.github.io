---
title: 코드블럭 테스트
subtitle: tree-sitter 구문 강조기 도입 실험
---

```python
import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import pandas as pd

(train_input, train_target), (test_input, test_target) = keras.datasets.cifar10.load_data()

print(train_input.shape)
print(train_target.shape)
target = train_target.reshape(50000)
print(target.shape)
print(pd.Series(target).value_counts())

train_scaled = train_input / 255.0  
test_scaled = test_input / 255.0 

fig, axs = plt.subplots(1, 10)
for i in range(10):
    axs[i].imshow(train_input[i])
    axs[i].axis('off')
plt.show()
print([train_target[i] for i in range(10)])

train_scaled, val_scaled, train_target, val_target = train_test_split(train_scaled, train_target, test_size=0.2)

model = keras.Sequential()
model.add(keras.layers.Conv2D(36, kernel_size=4, activation='relu', padding='same', input_shape=(32,32,3)))
model.add(keras.layers.MaxPooling2D(2))
model.add(keras.layers.Conv2D(72, kernel_size=(4,4), activation='relu', padding='same'))
model.add(keras.layers.MaxPooling2D(2))

# 위에 코드는 필터 개수만 바꾼 거임.

model.add(keras.layers.Flatten())
model.add(keras.layers.Dense(120, activation='relu'))
model.add(keras.layers.Dropout(0.3))
model.add(keras.layers.Dense(10, activation='softmax'))

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
history = model.fit(train_scaled, train_target, epochs=20, validation_data=(val_scaled, val_target))
model.summary()

plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.xlabel('epoch')
plt.ylabel('loss')
plt.legend(['train', 'val'])
plt.show()



model.save('cnn_model2.h5')
model = keras.models.load_model('cnn_model2.h5')
model.evaluate(test_scaled, test_target)
i = 3005
# i = np.arange(10)
new_data = test_scaled[i:i+1]
t = test_target[i]
p = model.predict(new_data)
y = np.argmax(p, axis=1)
print(p.round(2))
print(y)                              
print(t)              

fig, axs = plt.subplots(1, 1)
for i in range(1):
    axs.imshow(new_data[i])
    axs.axis('off')
plt.show()

from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score
test_pred = np.argmax(model.predict(test_scaled), axis=1)
cm = confusion_matrix(test_target, test_pred)
accuracy = accuracy_score(test_target, test_pred)
precision = precision_score(test_target, test_pred, average=None)
recall = recall_score(test_target, test_pred, average=None)  
f1 = f1_score(test_target, test_pred, average=None)

print("Confusion Matrix:\n", cm)
print(f"Accuracy: {accuracy}")
print(f"Precision: {precision.round(3)}")
print(f"Recall (Sensitivity): {recall.round(3)}")
print(f"F1 Score: {f1.round(3)}")
```
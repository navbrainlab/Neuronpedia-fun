import json
import requests

SECRET = "localhost-secret"
# 请求的 URL
#url = "https://www.neuronpedia.org/api/steer"
# 要发送的数据
# data = {
#     "prompt": "The most iconic structure on Earth is", 
#     "modelId": "gemma-2-9b-it",                         
#     "temperature": 0.2,                            
#     "n_tokens": 50,
#     "strength_multiplier": 1.0,
#     "seed": 16,
#     "freq_penalty": 0.0,
#     "features": [{
#         "modelId":"gemma-2-9b-it",
#         "layer":"20-gemmascope-res-16k",
#         "index":3124,
#         "strength":38.5}
#     ]
# }

#使用本地inference
url = "http://localhost:5002/v1/steer/completion"
data = {
    "prompt": "The most iconic structure on Earth is",
    "model": "gemma-2-9b-it",           
    "temperature": 0.2,
    "n_completion_tokens": 50,           
    "strength_multiplier": 1.0,
    "seed": 16,
    "freq_penalty": 0.0,
    "steer_method": "SIMPLE_ADDITIVE",       
    "normalize_steering": True,          
    "types": ["STEERED","DEFAULT"],              
    "features": [{
        "model": "gemma-2-9b-it",         
        "source": "20-gemmascope-res-16k",
        "index": 3124,
        "strength": 38.5
    }]
}

headers = {
    "Content-Type": "application/json",
    "X-SECRET-KEY": SECRET
           }

# 发送请求
response = requests.post(url, json=data, headers=headers)
json_response = response.json()

# 打印结果
formatted_response = json.dumps(json_response, indent=4)
print(formatted_response)
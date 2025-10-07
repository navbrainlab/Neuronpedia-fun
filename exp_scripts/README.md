# steering.py 
里面记录了两种请求大模型运行的方式：   
一种是向neuronpedia官网进行申请推理服务器的资源   
另一种是在本地下载模型和权重以及SAE，在本地运行推理   
两者的api存在轻微的不同，输出的结果也有轻微不同   
## 参数
`prompt`:  输入提示文本，作为模型生成内容的起点   
`model`or`modelID`: "gemma-2-9b-it"   使用的语言模型名称,此处使用Gemma 2 9B指令调优版本   
`temperature`: 0.2    采样温度，控制生成文本的随机性   
`n_completion_tokens`or`n_tokens`: 50   期望生成的token数量   
`seed`: 16    随机种子，用于确保结果可重现  
`freq_penalty`: 0.0    频率惩罚系数，减少重复token的出现  

`steer_method`: "SIMPLE_ADDITIVE"  or  "ORTHOGONAL_DECOMP"  
`strength_multiplier`: 1.0    整体引导强度的乘数因子,用于调整所有特征的综合影响程度  
`normalize_steering`: True  
`types`: ["STEERED","DEFAULT"]请求的生成类型  
`features`: [...]  要激活的特征列表  

每个特征包含：  
`model`or`modelID`: "gemma-2-9b-it" - 特征对应的模型  
`source`or`layer`: "20-gemmascope-res-16k" - 特征来源的数据集  
`index`: 3124 - 神经元特征的索引编号  
`strength`: 38.5 - 该特征的激活强度  

请求头配置  
`Content-Type`: "application/json"  
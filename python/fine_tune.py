from transformers import AutoTokenizer, AutoModelForMaskedLM
from transformers import DataCollatorForLanguageModeling
from transformers import Trainer, TrainingArguments
import datasets
import json

# Load tokenizer and model
model_name = "HooshvareLab/bert-base-parsbert-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForMaskedLM.from_pretrained(model_name)

# Prepare dataset
def prepare_dataset(data_path):
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    texts = [f"{item['input']} [SEP] {json.dumps(item['output'])}" for item in data]
    return datasets.Dataset.from_dict({'text': texts})

dataset = prepare_dataset("data/training_data.json")

# Tokenize and structure the dataset
def tokenize_function(examples):
    tokenized = tokenizer(
        examples["text"],
        truncation=True,
        padding="max_length",
        max_length=128
    )
    tokenized["labels"] = tokenized["input_ids"]  # MLM task: labels = input_ids
    return tokenized

tokenized_dataset = dataset.map(tokenize_function, batched=True)

# Split into train and validation sets
train_test_split = tokenized_dataset.train_test_split(test_size=0.1)
train_dataset = train_test_split["train"]
eval_dataset = train_test_split["test"]

# Data collator with masking
data_collator = DataCollatorForLanguageModeling(
    tokenizer=tokenizer,
    mlm=True,
    mlm_probability=0.15
)

# Training arguments
training_args = TrainingArguments(
    output_dir="./parsbert-style-tuned",
    num_train_epochs=3,
    per_device_train_batch_size=8,
    save_steps=500,
    save_total_limit=2,
    evaluation_strategy="steps",
    eval_steps=500,
    remove_unused_columns=False,
    logging_dir="./logs",
    logging_steps=100,
    learning_rate=5e-5,
    warmup_steps=500
)

# Initialize trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    data_collator=data_collator
)

# Train the model
trainer.train()

# Evaluate the model
eval_results = trainer.evaluate()
print("Evaluation results:", eval_results)

# Save fine-tuned model
model.save_pretrained("./parsbert-style-tuned")
tokenizer.save_pretrained("./parsbert-style-tuned")

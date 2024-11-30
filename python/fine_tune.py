from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, Seq2SeqTrainer, Seq2SeqTrainingArguments
from datasets import load_dataset

# Load dataset
dataset = load_dataset("json", data_files="persian_dataset.json")

# Tokenizer and Model (Use T5 or ParsBERT-based T5 model)
tokenizer = AutoTokenizer.from_pretrained("HooshvareLab/t5-fa-small")
model = AutoModelForSeq2SeqLM.from_pretrained("HooshvareLab/t5-fa-small")

def preprocess_function(examples):
    inputs = [ex["input"] for ex in examples["data"]]
    targets = [str(ex["output"]) for ex in examples["data"]]
    model_inputs = tokenizer(inputs, max_length=128, truncation=True)
    labels = tokenizer(targets, max_length=128, truncation=True).input_ids
    model_inputs["labels"] = labels
    return model_inputs

tokenized_data = dataset.map(preprocess_function, batched=True)

# Training Arguments
training_args = Seq2SeqTrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=4,
    num_train_epochs=3,
    save_total_limit=2,
)

# Trainer
trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_data["train"],
    tokenizer=tokenizer,
)

# Fine-tune model
trainer.train()
model.save_pretrained("./fine_tuned_model")
tokenizer.save_pretrained("./fine_tuned_model")

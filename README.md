#### Были опущены

* валидация входных данных (happy case)
* обработка drain
* возврат ошибок
* etc

### API

#### Income
```json
{
    "properties": {
        "key": {
            "type": "string"
        },
        "id": {
            "type": "string"
        },
        "value": {
            "type": "object"
        },
        "command": {
            "type": "string",
            "enum": ["write", "read", "delete"]
        },
    },
    "required": ["command", "key"]
}
```
Дописывать oneOf по типу комманды не стал, это очевидно.
В реальной имплементации обычно ставлю ajv перед консьюмером.
Как и в рекоммендуемой реализации rpc для rabbit, можно указать id, по которому получить сообщение из outcome/

#### Outcome
```json
{
    "properties": {
        "id": {
            "type": "string"
        },
        "result": {
            "type": "object",
            "properties": {
                "success": {
                    "type": "boolean",
                },
                "data": {
                    "type": "any",
                }
            }
        },
    }
}
```

```
docker-compose -f ./deployments/docker-compose.yml up 
```
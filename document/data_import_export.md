data_io.py

## インポート・エクスポート機能

データを紛失しないために、import&export機能を設ける。

2つのタイプでのimport_exportファイルを作成する。
ファイルをインポート・エクスポートする際どちらのタイプでエクスポートするか決める。

### ファイルを分ける理由<hr>
タイプ2の場合データ容量が大きくなるにつれて、ファイルサイズも大きくなってしまう。
タイプ1を選択することで、
定期的にバックアップを手動でとる際にファイルサイズの大きい形でexportする必要がなくなる。

どのような場合にタイプ2を選択するのか。（タイプ2を選択することのメリット。）

1. questionsのjsonファイルに新たにquestionが作成されるたびにjsonファイルにも新規のquestionを追記。

categories.csv
subcategories.csv
questions.csv
category_question.json
subcategory_question.json

新規でquestionを作成する毎に、githubへquestions.json, category_question.json, subcategory_question.jsonを作成する。


2. category,subcategory,questionを入れ子にした形でexportする。

zipファイルにしてexportする。

### インポート・エクスポートする際のデータの形<hr>
タイプ2でエクスポートしたファイルの中身例

```
{
    "type": 2,
    "category": [
        {
            "name": "aws",
            "subcategories": [
                {
                    "name": "IAM",
                    "questions": [
                        {
                            "problem": "どうして複数のポリシーをひとつにまとめてroleとして扱うのか",
                            "answer": [
                                ""
                            ],
                            "memo": "複数のポリシーをひとつにまとめてroleとして扱うことで、複数のポリシーをひとつのエンティティに紐づけることができるため、管理がしやすくなる",
                            "is_correct": false
                        }
                    ]
                },
                {
                    "name": "fargate",
                    "questions": [
                        {
                            "problem": "ECS on ECS とECS on Fargateの違いをのべよ",
                            "answer": [
                                "xxx"
                            ],
                            "memo": "ECS on ECS とECS on Fargateの違い",
                            "is_correct": false
                        }
                    ]
                },
                {
                    "name": "codepipeline",
                    "questions": [
                        {
                            "problem": "green-blue 環境について説明してください",
                            "answer": [
                                "アプリケーションをデプロイする際、例えばオンプレミスな物理サーバ上で動作するアプリケーションの場合、メンテナンス日を設けて一時的にサービス停止させたりしてサーバ上で動作するアプリケーションを入れ替えたりすることが多いかと思います。",
                                "ブルーグリーンデプロイメントはアプリケーションをデプロイする際のデプロイ方式の１つでAWS等のクラウドサービスでアプリケーションをデプロイする場合、クラウドのメリットの１つとなるサービス作成・廃棄することが簡単にできることを活かして、もう１セットのサービスを用意して、テストしてから切り替えることで安全に、ダウンタイムもほぼ無いリリースができる技術となります。"
                            ],
                            "memo": "aaaaaaa",
                            "is_correct": true
                        }
                    ]
                }
            ]
        },
        {
            "name": "biology",
            "subcategories": [
                {
                    "name": "physiology",
                    "questions": []
                },
                {
                    "name": "development",
                    "questions": []
                },
                {
                    "name": "taxnomy",
                    "questions": []
                }
            ]
        },
        {
            "name": "economics",
            "subcategories": []
        }
    ]
}
```
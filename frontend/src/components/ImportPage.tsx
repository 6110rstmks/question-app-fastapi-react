import React, { useState } from "react"



const ImportPage = () => {

      
    // ファイル選択時のイベントハンドラ
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          setFile(event.target.files[0]);
        }
    };

      // フォーム送信時のイベントハンドラ
    const handleFileSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!file) {
        setMessage("ファイルを選択してください");
        return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
        const response = await fetch("http://127.0.0.1:8000/categories/import", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            setMessage("アップロード成功: " + data.message);
        } else {
            const errorData = await response.json();
            setMessage("エラー: " + (errorData.detail || "アップロードに失敗しました"));
        }
        } catch (error) {
        setMessage("エラー: " + error);
        }
    };

    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>("");
    return (
        <div>
            <h4>JSONファイルアップロード</h4>
            <form onSubmit={handleFileSubmit}>
                <div>
                <input type="file" accept=".json" onChange={handleFileChange} />
                </div>
                <button type="submit" style={{ marginTop: "10px" }}>
                アップロード
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default ImportPage
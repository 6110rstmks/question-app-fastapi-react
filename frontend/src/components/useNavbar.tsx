export const useNavbar = () => {

    const handleJsonExport = async () => {    
        try {
            const response = await fetch("http://localhost:8000/categories/export/json", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Blobオブジェクトを作成
            const blob = await response.blob();

            // ダウンロードリンクを作成
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            // ファイル名を設定（バックエンド側で指定した名前と一致させる）
            // link.download = "categories.csv";
            // link.download = "backup_self_made_app.zip";
            link.download = "categories_export4.json";

            // ダウンロードをトリガー
            document.body.appendChild(link);
            link.click();

            // リンクをクリーンアップ
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error exporting file:", error);
        }
    };

    const handleCSVExport = async () => {    
        const response = await fetch("http://localhost:8000/categories/export/csv", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Blobオブジェクトを作成
        const blob = await response.blob();

        // ダウンロードリンクを作成
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // ファイル名を設定（バックエンド側で指定した名前と一致させる）
        // link.download = "categories.csv";
        // link.download = "backup_self_made_app.zip";
        link.download = "backup_self_made_app.zip";

        // ダウンロードをトリガー
        document.body.appendChild(link);
        link.click();

        // リンクをクリーンアップ
        link.remove();
        window.URL.revokeObjectURL(url);
    };
    return {
        handleJsonExport,
        handleCSVExport
    };
}
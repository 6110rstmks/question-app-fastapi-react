const Today = () => {

    const handleMTComplete = () => {
    }

    const menu = ["A", "B", "C"]

    return (
        <div>
            <div>Today M.T ：　{menu[1]}</div>


            <p>これらは昼休みにおこないます。</p>
    
            <button onClick={handleMTComplete}>完了</button>
        </div>
    )
}

export default Today
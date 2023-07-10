const FormatTime = require("../utils/FormatTime");
const Learing = async (value, connection, flashcard) => {
    const timeout_interval = new Date();
    const current_time = new Date();
    switch (value) {
        case "easy":
            if (flashcard.last_evaluate == "easy") {
                timeout_interval.setDate(current_time.getDate() + 1);
                await connection.execute(
                    "UPDATE MEMORIZE SET STATE = 'G', TIMEOUT_INTERVAL = ? WHERE FLASHCARD_ID = ? AND COLLECTION_ID = ? AND USER_ID = ?",
                    [
                        FormatTime(timeout_interval),
                        flashcard.flashcard_id,
                        flashcard.collection_id,
                        flashcard.user_id,
                    ]
                );
            } else {
                timeout_interval.setMinutes(current_time.getMinutes() + 10);
                await connection.execute(
                    "UPDATE MEMORIZE SET TIMEOUT_INTERVAL = ?, LAST_EVALUATE = 'easy' WHERE FLASHCARD_ID = ? AND COLLECTION_ID = ? AND USER_ID = ?",
                    [
                        FormatTime(timeout_interval),
                        flashcard.flashcard_id,
                        flashcard.collection_id,
                        flashcard.user_id,
                    ]
                );
            }
            break;
        case "hard":
            timeout_interval.setMinutes(current_time.getMinutes() + 10);
            await connection.execute(
                "UPDATE MEMORIZE SET TIMEOUT_INTERVAL = ?, LAST_EVALUATE = 'hard' WHERE FLASHCARD_ID = ? AND COLLECTION_ID = ? AND USER_ID = ? ",
                [
                    FormatTime(timeout_interval),
                    flashcard.flashcard_id,
                    flashcard.collection_id,
                    flashcard.user_id,
                ]
            );
            break;
        case "again":
            timeout_interval.setMinutes(current_time.getMinutes() + 1);
            await connection.execute(
                "UPDATE MEMORIZE SET TIMEOUT_INTERVAL = ?, LAST_EVALUATE = 'again' WHERE FLASHCARD_ID = ? AND COLLECTION_ID = ? AND USER_ID = ? ",
                [
                    FormatTime(timeout_interval),
                    flashcard.flashcard_id,
                    flashcard.collection_id,
                    flashcard.user_id,
                ]
            );
            break;
        default:
            break;
    }
    await connection.execute(
        "UPDATE MEMORIZE SET LAST_VISIT = ? WHERE FLASHCARD_ID = ? AND COLLECTION_ID = ? AND USER_ID = ? ",
        [
            FormatTime(current_time),
            flashcard.flashcard_id,
            flashcard.collection_id,
            flashcard.user_id,
        ]
    );
};

module.exports = Learing;

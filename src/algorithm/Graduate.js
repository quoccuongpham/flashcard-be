const FormatTime = require("../utils/FormatTime");

const Graduate = async (value, connection, flashcard) => {
    let new_flashcard = { ...flashcard };

    const timeout_interval = new Date();
    const old_interval =
        new_flashcard.timeout_interval - new_flashcard.last_visit;

    let new_interval = 0;
    switch (value) {
        case "easy":
            new_interval = old_interval * flashcard.ease * 1.3;
            timeout_interval.setMilliseconds(
                timeout_interval.getMilliseconds() + new_interval
            );
            new_flashcard.timeout_interval = FormatTime(timeout_interval);
            new_flashcard.last_visit = FormatTime(new Date());
            new_flashcard.last_evaluate = "easy";
            break;
        case "hard":
            if (new_flashcard.ease > 1.45) {
                new_flashcard.ease -= 0.15;
            } else {
                new_flashcard.ease = 1.3;
            }
            new_interval = old_interval * new_flashcard.ease;
            timeout_interval.setMilliseconds(
                timeout_interval.getMilliseconds() + new_interval
            );
            new_flashcard.timeout_interval = FormatTime(timeout_interval);
            new_flashcard.last_visit = FormatTime(new Date());
            new_flashcard.last_evaluate = "hard";
            break;
        case "again":
            new_flashcard.state = "L";
            timeout_interval.setMinutes(timeout_interval.getMinutes() + 10);
            new_flashcard.timeout_interval = FormatTime(timeout_interval);
            new_flashcard.last_visit = FormatTime(new Date());
            new_flashcard.last_evaluate = "again";
            break;
        default:
            break;
    }
    console.log(new_flashcard);
    //todo: Update database
    try {
        await connection.execute(
            "UPDATE MEMORIZE SET EASE = ?,TIMEOUT_INTERVAL=? ,LAST_VISIT = ?,STATE = ?, LAST_EVALUATE = ? WHERE FLASHCARD_ID = ? AND COLLECTION_ID = ? AND USER_ID = ? ",
            [
                new_flashcard.ease,
                new_flashcard.timeout_interval,
                new_flashcard.last_visit,
                new_flashcard.state,
                new_flashcard.last_evaluate,
                new_flashcard.flashcard_id,
                new_flashcard.collection_id,
                new_flashcard.user_id,
            ]
        );
    } catch (error) {
        if (error) throw error;
    }
};

module.exports = Graduate;

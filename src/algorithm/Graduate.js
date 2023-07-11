const db = require("../models/index");
const FormatTime = require("../utils/FormatTime");

const Graduate = async (memorize, flashcard_id, value) => {
    const timeout_interval = new Date();
    const old_interval = memorize.timeout_interval - memorize.updatedAt;

    let new_interval = 0;
    switch (value) {
        case "easy":
            new_interval = old_interval * memorize.ease * 1.3;
            timeout_interval.setMilliseconds(
                timeout_interval.getMilliseconds() + new_interval
            );
            memorize.timeout_interval = FormatTime(timeout_interval);
            memorize.last_evaluate = "easy";
            break;
        case "hard":
            if (memorize.ease > 1.45) {
                memorize.ease -= 0.15;
            } else {
                memorize.ease = 1.3;
            }
            new_interval = old_interval * memorize.ease;
            timeout_interval.setMilliseconds(
                timeout_interval.getMilliseconds() + new_interval
            );
            memorize.timeout_interval = FormatTime(timeout_interval);
            memorize.last_evaluate = "hard";
            break;
        case "again":
            memorize.state = "L";
            timeout_interval.setMinutes(timeout_interval.getMinutes() + 10);
            memorize.timeout_interval = FormatTime(timeout_interval);
            memorize.last_evaluate = "again";
            break;
        default:
            break;
    }
    console.log(memorize);
    //todo: Update database
    await db.sequelize.model("Memorize").update(memorize, {
        where: {
            flashcard_id: flashcard_id,
        },
    });
};

module.exports = Graduate;

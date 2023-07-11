const db = require("../models/index");
const FormatTime = require("../utils/FormatTime");

const Learing = async (memorize, flashcard_id, value) => {
    const timeout_interval = new Date();
    const current_time = new Date();

    switch (value) {
        case "easy":
            if (memorize.dataValues.last_evaluate == "easy") {
                timeout_interval.setDate(current_time.getDate() + 1);
                // update state and timeout_interval
                await db.sequelize.model("Memorize").update(
                    {
                        state: "G",
                        timeout_interval: FormatTime(timeout_interval),
                    },
                    {
                        where: {
                            flashcard_id: flashcard_id,
                        },
                    }
                );
            } else {
                timeout_interval.setMinutes(current_time.getMinutes() + 10);

                // update last_evaluate and timeout_interval
                await db.sequelize.model("Memorize").update(
                    {
                        timeout_interval: FormatTime(timeout_interval),
                        last_evaluate: "easy",
                    },
                    {
                        where: {
                            flashcard_id: flashcard_id,
                        },
                    }
                );
            }
            break;
        case "hard":
            timeout_interval.setMinutes(current_time.getMinutes() + 10);
            await db.sequelize.model("Memorize").update(
                {
                    timeout_interval: FormatTime(timeout_interval),
                    last_evaluate: "hard",
                },
                {
                    where: {
                        flashcard_id: flashcard_id,
                    },
                }
            );
            break;
        case "again":
            timeout_interval.setMinutes(current_time.getMinutes() + 1);
            await db.sequelize.model("Memorize").update(
                {
                    timeout_interval: FormatTime(timeout_interval),
                    last_evaluate: "again",
                },
                {
                    where: {
                        flashcard_id: flashcard_id,
                    },
                }
            );
            break;
        default:
            break;
    }
};

module.exports = Learing;

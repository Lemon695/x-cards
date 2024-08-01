import type { PlasmoMessaging } from "@plasmohq/messaging"
import * as _ from 'lodash-es'


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const action = req.body.action;
    if (action === 'get-tweet') {
        const url = req.body.url;
        const response = await fetch(`https://x-cards.net/api/x?url=${url}`, {
            method: 'GET',

        });
        if (response.status !== 200 || !response.ok) {
            res.send({ error: 'error' });
        }
        const data = await response.json();

        return res.send(data.data);
    } 
    // else if (action === 'get-card-templates') {
    //     const templates = await templatesStorage.getAll();
    //     console.log('templates find in bg', templates)
    //     return res.send(templates);
    // }

}
export default handler;
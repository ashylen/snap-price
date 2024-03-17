const Stories = [
    {
        storyId: 'S-01',
        storyTitle: 'Bethanys is hiring',
        storyImage: require('../assets/pexels-anna-tarazevich-5598302.jpg'),
        storySnippet: `Bethanys Pie Shop is looking for talent. Hiring at all locations`,
        story: `Bethanys is on a hiring binge. Expansion at all stores had left many openings. We also have two new locations that have just opened. Bethanys is not just a job, its a career. And we aren't co workers, we are family. All level of positions exist from entry level to upper management. If you, or somebody you know is qualified contact us and forward your resume. Hurry up because these opportunities will not last long.`,
        author: 'Rob Smith'
    },
    {
        storyId: 'S-02',
        storyTitle: 'We now do catering',
        storyImage: require('../assets/pexels-elle-hughes-2696064.jpg'),
        storySnippet: `Let Bethanys cater your next big event`,
        story: `Bethanys has branched out into catering. Our expertise in hosting our revents has led us to offer our service to others for their events. And before you say that you need more than pies and cakes, no worries. Even though this will always be a pie shop, when caering we also provide appetizers, entrees, salads, and beverages. Our prices are based upon the size of your event and the staff required. The rates are fair and provide you with a lot of food. Many people are not capable of catering theris own event, so let the professionals take care of it for you. Please bear in mind that you should book at least 2 weeks before your event. Contact us for a quote`,
        author: 'Jane Doe'
    },
    {
        storyId: 'S-03',
        storyTitle: 'Grand opening',
        storyImage: require('../assets/pexels-rdne-stock-project-7563553.jpg'),
        storySnippet: `Grand Opening for two new locations`,
        story: `Bethanys has recently celebrated the grand opening of two new stores. The demand has been high with many patrons travelling far and wide to get their favorite pies. Bethanys listened and added two ner locations in the most requested areas. I cannot begin to understand the frustration they may feel when travelling for over an hour only to find their favorite Cheesecake has sold out. Now this should not be a problem since the store is local.  Checek out the new locations near you`,
        author: 'Mike Prince'
    },
    {
        storyId: 'S-04',
        storyTitle: 'Seasonal fruit pies',
        storyImage: require('../assets/pexels-solodsha-8104732.jpg'),
        storySnippet: `Seasonal fruit pies are back`,
        story: `Seasonal fruit pies are back for a limited time. Enjoy these specialty pies brimming with fruit. This is locally sourced fruit purchased directly from farmers in the community. Ther freshly baked pies are delicious, and sure to be a hit with your family. The pies will only be available until the local supply of fruits are gone. Don't miss out, order now. You can even order directly from this app `,
        author: 'Rob Rugby'
    }
];

export const grabAllStories = () => {
    return Stories
};

export const grabOneStory = (id) => {
    return Stories.find((news) => (news.storyId == id));
};
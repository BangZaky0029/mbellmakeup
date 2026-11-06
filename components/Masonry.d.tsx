import Masonry from './Masonry';

const items = [
    {
        id: '1',
        img: 'https://picsum.photos/id/1015/600/900?grayscale',
        width: 600,
        height: 900,
        title: 'Alexey Topolyanskiy',
        url: 'https://unsplash.com/photos/-oWyJoSqBRM'
    },
    {
        id: '2',
        img: 'https://picsum.photos/id/1011/600/750?grayscale',
        width: 600,
        height: 750,
        title: 'Roberto Nickson',
        url: 'https://unsplash.com/photos/7BjmDICVloE'
    },
    // ...more items
];

<Masonry
    items={items}
    columnWidth={240}
    gap={12}
    radius={12}
    animateFrom="bottom"
    hoverEffect="zoom"
    captions="hover"
    lightbox
    draggable
    columns="auto"
    stagger={0.05}
    duration={0.6}
    bounce={0.15}
    blurToFocus
    focusOnHover={false}
    parallax={0}
    revealOnScroll
/>
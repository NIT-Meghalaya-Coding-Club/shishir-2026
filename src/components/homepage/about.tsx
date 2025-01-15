import Image from 'next/image';

export default function About() {
    return (
    <div className="relative before:h-[100%] before:w-[100%] z-10 h-[250vh] min-w-92 bg-[#000717] ">
        <Image
            src="/img/four.png"
            alt = "About Us"
            height = {2000}
            width = {2000}
        />
            <div className="a_content_div absolute right-[2vw] top-[10vh] w-[50vw]">
                <p className="a_content_a text-[#d4a200] text-[5vw] text-center">ABOUT US</p>
                <p className='a_content_b text-[#ffd960] text-[1.9vw] mt-[10vh] text-right'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus laudantium esse repellat quasi perspiciatis saepe non doloribus quos pariatur fugiat aperiam quidem repellendus, consectetur quia! Qui, vel tenetur! Iusto aperiam blanditiis necessitatibus vel numquam fugiat totam in dolorem aliquam quisquam dolor ullam quos incidunt dicta tempore consectetur, eveniet accusamus. Corrupti magnam quidem totam, sit nobis illo possimus nisi necessitatibus et. Temporibus quisquam sequi distinctio in repellendus voluptates eveniet totam dolorum quaerat adipisci. Aliquam quo, modi quibusdam quia nisi minima laborum, quidem illum, adipisci dicta fugiat dignissimos esse ratione recusandae! Quis necessitatibus provident cum, blanditiis possimus nesciunt optio adipisci. Eius, voluptatum!     
                </p>
            </div>
            <div className="a_content_div_b  absolute left-[2vw] bottom-0 mt-[5vh] w-[50vw]">
                <p className="a_content_a text-[#d4a200] text-[5vw] text-left ">THEME</p>
                <p className='text-[#d4a200] text-[5vw] text-left'>An Engima of Ethnicity</p>
                <p className='a_content_b text-[#ffd960] text-[1.9vw] mt-[10vh] text-left'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, vitae amet. Quisquam blanditiis nesciunt minima fuga minus repellat voluptas perspiciatis est voluptatem corporis, impedit dolorum dolor temporibus placeat fugit molestiae odio porro voluptatibus dicta nihil non quos culpa. Aperiam fugiat commodi accusantium provident exercitationem aliquam, consectetur nam? Praesentium, magnam quae.
                </p>
            </div>
        </div>
    );
}
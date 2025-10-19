export default function Prayar({ name, time }) {
    return (
        <>
            <div className="paryar container border  p-3">
                <div className="row">
                    <div className="col-6">
                        <p className="name-prayar fs-4"> {name}</p>
                    </div>
                    <div className="col-6 text-center">

                        <p className="time-prayar fs-4">{time}</p>
                    </div>
                </div>



            </div>
        </>
    );

}

import styled from "@emotion/styled"
import React from "react"
import cherries from "../images/product-cherries.png"
import hearts from "../images/product-hearts.png"

const Container = styled.div`
padding: 2rem;
    .list {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 2rem;
        .item {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
    }
    input {
        border: 1px solid var(--color);
    }
`

const ShopPage = () => {
    return (
        <Container>
            <form name="shop" netlify>
                <input type="hidden" name="form-name" value="shop" />
                <fieldset>
                    <legend>Motiv</legend>

                    <div className="list list--motives">
                        <div className="item item--motive">
                            <label>
                                <input type="radio" name="motive" value="hearts-olive"
                                    checked />
                                <img src={hearts} alt="Hearts" />
                                Hearts Olive (35,00 EUR)</label>
                        </div>

                        <div className="item item--motive">
                            <label>
                                <input type="radio" name="motive" value="cherries-olive" />
                                <img src={cherries} alt="Cherries" />
                                Cherries Olive (35,00 EUR)</label>
                        </div>
                        <div className="item item--motive">
                            <label>
                                <input type="radio" name="motive" value="hearts-purple"
                                />
                                <img src={hearts} alt="Hearts" />
                                Hearts Purple (35,00 EUR)</label>
                        </div>

                        <div className="item item--motive">
                            <label>
                                <input type="radio" name="motive" value="cherries-purple" />
                                <img src={cherries} alt="Cherries" />
                                Cherries Purple (35,00 EUR)</label>
                        </div>
                        <div className="item item--motive">
                            <label>
                                <input type="radio" name="motive" value="hearts-blue"
                                />
                                <img src={hearts} alt="Hearts" />
                                Hearts Blue (35,00 EUR)</label>
                        </div>

                        <div className="item item--motive">
                            <label>
                                <input type="radio" name="motive" value="cherries-blue" />
                                <img src={cherries} alt="Cherries" />
                                Cherries Blue (35,00 EUR)</label>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Size</legend>
                    <select name="size">
                        <option>S</option>
                        <option>M</option>
                        <option>L</option>
                        <option>XL</option>
                    </select>
                </fieldset>
                <p>Leave your name and email and we will send you a payment request.
                    Shipping costs may vary depending on your country.</p>
                <p>
                    <label>Name <input type="text" name="name" /></label>
                </p>
                <p>
                    <label>Email <input type="email" name="email" /></label>
                </p>
                <p>
                    <label>Street/No <input type="text" name="steet" /></label>
                </p>
                <p>
                    <label>Zip <input type="text" name="zip" /></label>
                </p>
                <p>
                    <label>City <input type="text" name="city" /></label>
                </p>
                <p>
                    <label>Country <input type="text" name="country" /></label>
                </p>

                <p>
                    <button type="submit">Send</button>
                </p>
            </form>
        </Container>
    )
}

export default ShopPage;
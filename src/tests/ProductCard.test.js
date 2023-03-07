import { render, screen, waitFor } from "@testing-library/react"
import ProductCard from "../components/ProductCard"
import axios from "axios"

jest.mock("axios")

const axiosResponseMock = {
    data: {
        title: "MacBook Pro",
        description: "MacBook Pro 2021 with mini-LED display may launch between September, November",
        price: 1749,
        thumbnail: "https://i.dummyjson.com/data/products/6/thumbnail.png"
    }
}

describe("ProductCard", () => {
    
    test("renderiza", async () => {
        axios.get.mockResolvedValueOnce(axiosResponseMock)
        render(<ProductCard />)
        screen.debug()
        await waitFor(() => {})
        screen.debug()
    })

    test("renderiza inicialmente o carregamento", async () => {
        axios.get.mockResolvedValueOnce(axiosResponseMock)
        
        render(<ProductCard />)
        // screen.logTestingPlaygroundURL()
        
        const loading = screen.getByText(/loading\.\.\./i)
        expect(loading).toBeInTheDocument()

        expect(screen.queryByText(/macBook pro/i)).not.toBeInTheDocument()

        // daqui pra cima é a renderização inicial (Loading...)
        await waitFor(() => {})
        // daqui pra baixo é logo após a renderização do mock
    })

    test("renderiza o card corretamente após carregamento", async () => {
        axios.get.mockResolvedValueOnce(axiosResponseMock)
        
        render(<ProductCard />)

        await waitFor(() => {
            const title = screen.getByRole('heading', {
                name: /macbook pro/i
            })

            expect(title).toBeInTheDocument()

            expect(
                screen.getByRole('img', {
                    name: /thumbnail for macbook pro/i
                })
            ).toBeInTheDocument()
        }) // por padrão, o waitFor espera 1000ms e tenta validar a cada 50ms

        expect(
            screen.getByText(
                /macbook pro 2021 with mini\-led display may launch between september, november/i
            )
        ).toBeInTheDocument()

        expect(screen.getByText(/\$1749/i)).toBeInTheDocument()
        
        expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument()
        
        // screen.logTestingPlaygroundURL()
    })
})
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetWeather } from "./useGetWeather";
import { getWeather } from "../../../../shared";
import { vi } from "vitest";

vi.mock("../../../../shared", () => ({
  getWeather: vi.fn(),
}));

describe("useGetWeather", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("API muvaffaqiyatli", async () => {
    (getWeather as jest.Mock).mockResolvedValueOnce({ temp: 25 });

    const { result } = renderHook(() => useGetWeather(41.3, 69.2), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({ temp: 25 });
    expect(getWeather).toHaveBeenCalledWith(41.3, 69.2);
  });

  it("enabled = false", async () => {
    (getWeather as jest.Mock).mockClear();

    const { result } = renderHook(() => useGetWeather(41.3, 69.2, false), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.fetchStatus).toBe("idle");
    });

    expect(getWeather).not.toHaveBeenCalled();
  });
});

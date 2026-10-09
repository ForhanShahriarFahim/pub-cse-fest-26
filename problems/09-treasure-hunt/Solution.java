import java.io.*;
import java.util.*;

public class Solution {
    static int n, m;
    static int[] head, nxt, to;

    // Fewest walkways from s to t (BFS), or -1 if t cannot be reached.
    static int bfs(int s, int t) {
        int[] dist = new int[n + 1];
        Arrays.fill(dist, -1);
        int[] que = new int[n];
        int qh = 0, qt = 0;
        dist[s] = 0;
        que[qt++] = s;
        while (qh < qt) {
            int u = que[qh++];
            if (u == t) return dist[u];
            for (int e = head[u]; e != -1; e = nxt[e]) {
                int v = to[e];
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    que[qt++] = v;
                }
            }
        }
        return -1;
    }

    public static void main(String[] args) throws IOException {
        DataInputStream in = new DataInputStream(new BufferedInputStream(System.in, 1 << 16));
        n = readInt(in);
        m = readInt(in);
        head = new int[n + 1];
        Arrays.fill(head, -1);
        nxt = new int[2 * m];
        to = new int[2 * m];
        for (int i = 0; i < m; i++) {
            int u = readInt(in), v = readInt(in);
            to[2 * i] = v; nxt[2 * i] = head[u]; head[u] = 2 * i;
            to[2 * i + 1] = u; nxt[2 * i + 1] = head[v]; head[v] = 2 * i + 1;
        }
        int k = readInt(in);
        long total = 0;
        int at = 1;
        boolean ok = true;
        for (int i = 0; i < k; i++) {
            int c = readInt(in);
            if (!ok) continue;
            int d = bfs(at, c);
            if (d == -1) ok = false;
            else total += d;
            at = c;
        }
        System.out.println(ok ? total : -1);
    }

    static int readInt(DataInputStream in) throws IOException {
        int ret = 0, b = in.read();
        while (b < '0' || b > '9') b = in.read();
        while (b >= '0' && b <= '9') {
            ret = ret * 10 + (b - '0');
            b = in.read();
        }
        return ret;
    }
}

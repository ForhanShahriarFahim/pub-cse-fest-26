import java.util.*;

public class Sol {
    static boolean valid(String s) {
        if (s.length() != 11) return false;
        if (!s.startsWith("CSE")) return false;
        if (s.charAt(3) != '-' || s.charAt(6) != '-') return false;
        for (int i : new int[]{4, 5, 7, 8, 9, 10}) {
            char c = s.charAt(i);
            if (c < '0' || c > '9') return false;
        }
        int year = Integer.parseInt(s.substring(4, 6));
        if (year < 20 || year > 26) return false;
        return !s.substring(7).equals("0000");
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        while (t-- > 0) sb.append(valid(sc.next()) ? "VALID" : "INVALID").append('\n');
        System.out.print(sb);
    }
}

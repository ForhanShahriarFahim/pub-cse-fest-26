#include <stdio.h>
#include <string.h>
#include <ctype.h>

int valid(const char *s) {
    if (strlen(s) != 11) return 0;
    if (strncmp(s, "CSE", 3) != 0) return 0;
    if (s[3] != '-' || s[6] != '-') return 0;
    int pos[] = {4, 5, 7, 8, 9, 10};
    for (int i = 0; i < 6; i++)
        if (!isdigit((unsigned char)s[pos[i]])) return 0;
    int year = (s[4] - '0') * 10 + (s[5] - '0');
    if (year < 20 || year > 26) return 0;
    if (strcmp(s + 7, "0000") == 0) return 0;
    return 1;
}

int main(void) {
    int t;
    char s[32];
    scanf("%d", &t);
    while (t--) {
        scanf("%31s", s);
        puts(valid(s) ? "VALID" : "INVALID");
    }
    return 0;
}
